package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.app.bean.GradeUser;
import xd.app.dao.GradeUserRepository;
import xd.fw.bean.User;
import xd.fw.controller.BaseController;
import xd.fw.util.FwException;

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
    public PageContent obtainUsers(int page, int limit, GradeUser query){
        Page<GradeUser> list = gradeUserRepository.findAll(Example.of(query,queryMatcher()),pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
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
    public String saveUser(GradeUser gradeUser) throws Exception {
        fwService.runSessionCommit(()->{
            try {
                User user = gradeUser.getUser();
                user.setName(gradeUser.getCode());

                user = userRepositoryCustom.saveUser(user);
                gradeUser.setId(user.getId());

                gradeUserRepository.save(gradeUser);
            } catch (Exception e) {
                throw new FwException("can not save user",e);
            }
        });
        return DONE;
    }
}
