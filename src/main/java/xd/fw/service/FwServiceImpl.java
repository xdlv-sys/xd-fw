package xd.fw.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xd.fw.dao.SessionCommit;
import xd.fw.dao.SessionProcessor;

@Service
@Transactional(readOnly = true)
public class FwServiceImpl implements FwService{

    @Override
    @Transactional
    public void runSessionCommit(SessionCommit sessionCommit) {
        sessionCommit.process();
    }

    @Override
    @Transactional
    public <T> T runSessionProcess(SessionProcessor<T> processor) {
        return processor.process();
    }
}