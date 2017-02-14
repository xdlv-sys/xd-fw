package xd.fw.dao;

import xd.fw.bean.*;

import java.util.List;

public interface UserRepositoryCustom {

    void saveUser(User user) throws Exception;

    void saveRole(Role role, int deptId) throws Exception;

    void runSessionCommit(SessionCommit sessionCommit);

    <T> T runSessionProcess(SessionProcessor<T> processor);
}