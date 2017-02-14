package xd.fw.mk;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;
import org.springframework.stereotype.Service;
import xd.fw.bean.Mod;
import xd.fw.bean.Role;
import xd.fw.bean.User;
import xd.fw.dao.ModRepository;
import xd.fw.util.FwUtil;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by xd on 12/6/2016.
 */
@Service
public class SecurityAccessDecisionManager implements AccessDecisionManager {
    Logger logger = LoggerFactory.getLogger(SecurityAccessDecisionManager.class);
    @Autowired
    ModRepository modRepository;

    Set<String> securityMods = new HashSet<>();
    @PostConstruct
    public void loadAllSecurity(){
        logger.info("start to load all mods for security.");
        List<Mod> mods = modRepository.findAll();
        FwUtil.safeEach(mods, mod -> securityMods.add(
                mod.getUrl() == null ? "" : mod.getUrl() + ".cmd"));
        logger.info("security mods:{}", securityMods);
    }

    @Override
    public void decide(Authentication authentication, Object object, Collection<ConfigAttribute> configAttributes) throws AccessDeniedException, InsufficientAuthenticationException {
        //logger.info("{},{},{}", authentication, object, configAttributes);
        String cmd = ((FilterInvocation)object).getHttpRequest().getServletPath();
        if (!securityMods.contains(cmd)){
            return;
        }
        Object principal = authentication.getPrincipal();
        boolean accept = false;
        if (principal instanceof UserDetail){
            UserDetail userDetail = (UserDetail) principal;
            User user = userDetail.getUser();
            accept = accept(user,cmd);
        }
        if (!accept){
            throw new AccessDeniedException("no right for:" + cmd);
        }
    }

    private boolean accept(User user, String cmd){
        List<Role> roles = user.getRoles();
        if (roles == null){
            return false;
        }
        for (Role role : roles){
            if (role.getId() == -2){
                return true;
            }
            if (role.getMods() == null){
                continue;
            }
            for (Mod mod : role.getMods()){
                if (StringUtils.isEmpty(mod.getUrl())){
                    continue;
                }
                if (cmd.startsWith(mod.getUrl())){
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}
