package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import xd.app.bean.Grade;
import xd.app.bean.GradeUser;
import xd.app.dao.GradeRepository;
import xd.app.dao.GradeUserRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("grade")
public class GradeController extends TemplateController {
    @Autowired
    GradeRepository gradeRepository;
    @Autowired
    GradeUserRepository gradeUserRepository;

    @RequestMapping("obtain")
    @ResponseBody
    public PageContent obtain(int page, int limit, Grade query) {
        Page<Grade> list = gradeRepository.findAll(Example.of(query, queryMatcher()), pageRequest(page, limit, new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("delete")
    @ResponseBody
    public String delete(int[] ids) {
        for (int id : ids) {
            gradeRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("approve")
    @ResponseBody
    public String approve(int[] ids, Byte status) {
        fwService.runSessionCommit(() ->
                Arrays.stream(ids).forEach(id -> {
                    Grade grade = gradeRepository.getOne(id);
                    grade.setStatus(status);
                    gradeRepository.save(grade);
                }));
        return DONE;
    }

    @RequestMapping("save")
    @ResponseBody
    public String save(@RequestParam(required = false) MultipartFile file, Grade grade) throws Exception {
        if (file != null) {
            GradeUser gradeUser = gradeUserRepository.findOne(grade.getUser().getId());
            transfer(file, grade.getBelong(), gradeUser.getUser().getDept().getId(), ZZ_GRADE_TYPE);
            grade.setFileName(file.getOriginalFilename());
        }
        grade.getItems().forEach((item) -> item.setGrade(grade));
        gradeRepository.save(grade);

        return DONE;
    }

    @RequestMapping("showFile")
    public ModelAndView showFile(Integer id, HttpServletRequest request, HttpServletResponse response) throws Exception {
        Grade grade = gradeRepository.findOne(id);
        return download(request, response, relativeTemplatePath(grade.getBelong()
                , grade.getUser().getUser().getDept().getId()
                , ZZ_GRADE_TYPE), grade.getFileName());
    }
}
