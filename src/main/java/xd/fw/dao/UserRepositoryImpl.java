package xd.fw.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xd.fw.bean.Dept;
import xd.fw.bean.Mod;
import xd.fw.bean.Role;
import xd.fw.bean.User;
import xd.fw.util.FwUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by xd on 2016/12/6.
 */
@Service
@Transactional(readOnly = true)
public class UserRepositoryImpl implements UserRepositoryCustom{

    @Autowired
    UserRepository userRepository;
    @Autowired
    DeptRepository deptRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    ModRepository modRepository;

    //private Logger logger = LoggerFactory.getLogger(UserRepositoryImpl.class);
    @Override
    @Transactional
    public User saveUser(User user) throws Exception {
        User record;
        if (user.getId() != null
                && null != (record = userRepository.findOne(user.getId()))
                && !record.getPassword().equals(user.getPassword())) {
            user.setPassword(FwUtil.md5(user.getPassword()));
            //merge(user);
        }
        user.setDept(deptRepository.findOne(user.getDept().getId()));

        List<Role> roles = user.getRoles() != null ? user.getRoles().stream().map(
                role -> roleRepository.findOne(role.getId())).collect(Collectors.toList()) : new ArrayList<>();
        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void saveRole(Role role, int deptId) throws Exception {
        Role record = role;
        if (role.getId() != null) {
            record = roleRepository.findOne(role.getId());
        }

        List<Mod> mods = new ArrayList<>();
        FwUtil.safeEach(role.getMods(),m-> mods.add(modRepository.findOne(m.getId())));
        record.setMods(mods);
        roleRepository.save(record);
        Dept dept = deptRepository.findOne(deptId);
        FwUtil.replaceOrAddListItem(dept.getRoles(), record, (t,o)->t.getId().equals(o.getId()));
        deptRepository.save(dept);
    }
}
