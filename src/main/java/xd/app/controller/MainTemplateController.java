package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import xd.app.bean.MainTemplate;
import xd.app.dao.MainTemplateRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("mainTemplate")
public class MainTemplateController extends TemplateController {
    @Autowired
    MainTemplateRepository mainTemplateRepository;

    @RequestMapping("obtain")
    @ResponseBody
    public PageContent obtainMainTemplates(int page, int limit, MainTemplate query) {
        return page(mainTemplateRepository.findAll(Example.of(query, queryMatcher())
                , pageRequest(page, limit)));
    }

    @RequestMapping("delete")
    @ResponseBody
    public String deleteMainTemplate(int[] templateIds) {
        for (int id : templateIds) {
            mainTemplateRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("save")
    @ResponseBody
    public String saveMainTemplate(MainTemplate mainTemplate) throws Exception {
        mainTemplateRepository.save(mainTemplate);
        return DONE;
    }

    @RequestMapping("showFile")
    public ModelAndView showFile(Integer id, HttpServletRequest request, HttpServletResponse response) throws Exception {
        MainTemplate template = mainTemplateRepository.findOne(id);
        template.setDownloadTimes(template.getDownloadTimes() + 1);
        mainTemplateRepository.save(template);
        return download(request, response, relativeTemplatePath(template.getRecord().getBelong()
                , template.getDeptId(), template.getRecord().getGenre()), template.getFileName());
    }
}
