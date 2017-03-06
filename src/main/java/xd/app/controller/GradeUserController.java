package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.app.bean.GradeUser;
import xd.app.dao.GradeUserRepository;
import xd.fw.bean.DynamicConf;
import xd.fw.bean.User;
import xd.fw.controller.BaseController;
import xd.fw.dao.ConfRepository;

/**
 * Created by xd on 2016/12/7.
 */
@Controller
@RequestMapping("gradeUser")
public class GradeUserController extends BaseController{
    @Autowired
    GradeUserRepository gradeUserRepository;

    @RequestMapping("obtainUsers")
    @ResponseBody
    public PageContent obtainUsers(int page, int limit){
        Page<GradeUser> list = gradeUserRepository.findAll(pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("deleteUser")
    @ResponseBody
    public String deleteUser(int[] userIds) {
        for (int id : userIds){
            gradeUserRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("saveUser")
    @ResponseBody
    public String saveUser(User user) throws Exception {
        userRepositoryCustom.saveUser(user);
        return DONE;
    }
}
