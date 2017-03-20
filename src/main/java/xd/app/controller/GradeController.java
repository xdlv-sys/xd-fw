package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.app.bean.Grade;
import xd.app.dao.GradeRepository;
import xd.fw.controller.BaseController;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("grade")
public class GradeController extends BaseController{
    @Autowired
    GradeRepository gradeRepository;

    @RequestMapping("obtain")
    @ResponseBody
    public PageContent obtain(int page, int limit, Grade query){
        Page<Grade> list = gradeRepository.findAll(Example.of(query,queryMatcher()),pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("delete")
    @ResponseBody
    public String delete(int[] ids) {
        for (int id : ids){
            gradeRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("save")
    @ResponseBody
    public String saveUser(Grade grade) throws Exception {
        return DONE;
    }
}
