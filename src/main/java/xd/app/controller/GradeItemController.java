package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.app.bean.GradeItem;
import xd.app.dao.GradeItemRepository;
import xd.fw.controller.BaseController;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("gradeItem")
public class GradeItemController extends BaseController{
    @Autowired
    GradeItemRepository gradeItemRepository;

    @RequestMapping("obtain")
    @ResponseBody
    public PageContent obtain(int page, int limit, GradeItem query){
        Page<GradeItem> list = gradeItemRepository.findAll(Example.of(query,queryMatcher()),pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("delete")
    @ResponseBody
    public String delete(int[] ids) {
        for (int id : ids){
            gradeItemRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("save")
    @ResponseBody
    public String save(GradeItem gradeItem) throws Exception {
        return DONE;
    }
}
