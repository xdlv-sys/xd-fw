package xd.fw.service;

import xd.fw.dao.SessionCommit;
import xd.fw.dao.SessionProcessor;

/**
 * Created by xd on 2/16/2017.
 */
public interface FwService {
    void runSessionCommit(SessionCommit sessionCommit);

    <T> T runSessionProcess(SessionProcessor<T> processor);

}
