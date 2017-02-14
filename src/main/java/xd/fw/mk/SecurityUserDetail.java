package xd.fw.mk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import xd.fw.dao.UserRepository;

import java.util.Collections;
import java.util.List;

/**
 * Created by xd on 12/5/2016.
 */
@Service
public class SecurityUserDetail implements UserDetailsService {

    @Autowired
    UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        xd.fw.bean.User user = userRepository.findByName(username);
        if (user == null){
            throw new UsernameNotFoundException("user name is invalidate");
        }
        List<SimpleGrantedAuthority> roles = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_EXE"));
        return new UserDetail(username,user.getPassword(),roles, user);
    }
}
