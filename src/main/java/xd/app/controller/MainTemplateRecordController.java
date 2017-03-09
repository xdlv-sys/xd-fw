package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import xd.app.bean.MainTemplate;
import xd.app.bean.MainTemplateRecord;
import xd.app.dao.MainTemplateRecordRepository;
import xd.app.dao.MainTemplateRepository;
import xd.fw.util.FwException;
import xd.fw.util.FwUtil;

import java.io.IOException;
import java.util.Date;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("mainTemplateRecord")
public class MainTemplateRecordController extends TemplateController{
    @Autowired
    MainTemplateRepository mainTemplateRepository;

    @Autowired
    MainTemplateRecordRepository mainTemplateRecordRepository;

    @RequestMapping("obtain")
    @ResponseBody
    public PageContent obtainMainTemplateRecords(int page, int limit){
        Page<MainTemplateRecord> list = mainTemplateRecordRepository.findAll(pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("save")
    @ResponseBody
    public String saveMainTemplateRecord(MultipartFile[] files
            , MainTemplateRecord mainTemplateRecord) throws Exception {
        fwService.runSessionCommit(()->{
            FwUtil.safeEach(files, (f,i)->{
                MainTemplate mainTemplate = mainTemplateRecord.getTemplates().get(i);
                transfer(f, mainTemplateRecord.getBelong()
                        , mainTemplate.getDeptId());
                mainTemplate.setFileName(f.getOriginalFilename());
                mainTemplate.setDownloadTimes(0);
            });

            if (mainTemplateRecord.getId() != null){
                boolean[] contains = {false};
                MainTemplateRecord record = mainTemplateRecordRepository.findOne(mainTemplateRecord.getId());
                FwUtil.safeEach(mainTemplateRecord.getTemplates(),(t)->{
                    FwUtil.safeEach(record.getTemplates(), (tb)->{
                        if (t.getDeptId().equals(tb.getDeptId())){
                            tb.setFileName(t.getFileName());
                            tb.setDownloadTimes(2);
                            contains[0] = true;
                        }
                    });
                    if (!contains[0]){
                        record.getTemplates().add(t);
                        t.setRecord(record);
                    }
                    contains[0] = false;
                });
                mainTemplateRecordRepository.save(record);
            } else {
                FwUtil.safeEach(mainTemplateRecord.getTemplates(), (t)-> t.setRecord(mainTemplateRecord));
                mainTemplateRecordRepository.save(mainTemplateRecord);
            }
        });
        return DONE;
    }

    private void transfer(MultipartFile file, Date belong, Integer deptId) {
        try {
            file.transferTo(templateFile(belong,deptId, file.getOriginalFilename()));
        } catch (IOException e) {
            throw new FwException("",e);
        }
    }
}
