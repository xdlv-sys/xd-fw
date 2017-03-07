package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.app.bean.MainTemplate;
import xd.app.dao.MainTemplateRepository;
import xd.fw.controller.BaseController;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("mainTemplate")
public class MainTemplateController extends BaseController{
    @Autowired
    MainTemplateRepository mainTemplateRepository;

    @RequestMapping("obtainMainTemplates")
    @ResponseBody
    public PageContent obtainMainTemplates(int page, int limit){
        Page<MainTemplate> list = mainTemplateRepository.findAll(pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("deleteMainTemplate")
    @ResponseBody
    public String deleteMainTemplate(int[] templateIds) {
        for (int id : templateIds){
            mainTemplateRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("saveMainTemplate")
    @ResponseBody
    public String saveMainTemplate(MainTemplate mainTemplate) throws Exception {
        mainTemplateRepository.save(mainTemplate);
        return DONE;
    }
}
