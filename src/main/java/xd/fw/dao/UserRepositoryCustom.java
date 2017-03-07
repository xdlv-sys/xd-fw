package xd.fw.dao;

import xd.fw.bean.Role;
import xd.fw.bean.User;

public interface UserRepositoryCustom {

    User saveUser(User user) throws Exception;

    void saveRole(Role role, int deptId) throws Exception;
}