package xd.fw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.fw.bean.User;
import xd.fw.dao.UserRepository;
import xd.fw.mk.UserDetail;
import xd.fw.util.FwException;
import xd.fw.util.FwUtil;

@Controller
@RequestMapping("user")
public class UserController extends BaseController{
    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    UserRepository userRepository;

    @Value("${version}")
    String version;

    @Value("${web-name}")
    String webName;

	@RequestMapping("userLogin")
    @ResponseBody
    public ModelRequest userLogin()throws Exception {
        UserDetail userDetail = (UserDetail)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return modelRequest(userDetail.getUser());

	}
    @RequestMapping("userLogout")
	public String userLogout(){
        //session.removeAttribute(USER_KEY);
        return DONE;
    }
    @RequestMapping("changePassword")
    @ResponseBody
    public String changePassword(User user, String newPassword) throws Exception {
        User dbUser = userRepository.findByName(user.getName());
        //check user password first
        if (!dbUser.getPassword().equals(FwUtil.md5(user.getPassword()))){
            throw new FwException("original user name is error!");
        }
        dbUser.setPassword(FwUtil.md5(newPassword));
        userRepository.save(dbUser);
        return DONE;
    }


    @RequestMapping("obtainUsers")
    @ResponseBody
    public PageContent obtainUsers(int page, int limit){
        Page<User> list = userRepository.findAll(pageRequest(page, limit,new Sort(Sort.Direction.ASC, "id")));
        return page(list);
    }

    @RequestMapping("deleteUser")
    @ResponseBody
    public String deleteUser(int[] userIds) {
        for (int id : userIds){
            userRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("saveUser")
    @ResponseBody
    public String saveUser(User user) throws Exception {
        userRepositoryCustom.saveUser(user);
        return DONE;
    }
    @RequestMapping("version")
    @ResponseBody
	public String version(){
        return String.format("{\"name\":\"%s\",\"version\":\"%s\"}",webName,version);
    }
}