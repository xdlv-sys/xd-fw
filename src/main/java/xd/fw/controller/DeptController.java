package xd.fw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.fw.dao.DeptRepository;

/**
 * Created by xd on 2016/12/14.
 */
@Controller
@RequestMapping("dept")
public class DeptController extends BaseController {
    @Autowired
    DeptRepository deptRepository;

    @RequestMapping("obtainDepts")
    @ResponseBody
    public PageContent obtainDepts(int page, int limit) {
        return page(deptRepository.findAll(pageRequest(page, limit)));
    }
}
