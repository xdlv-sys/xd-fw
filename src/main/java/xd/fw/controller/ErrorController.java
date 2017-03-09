package xd.fw.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by xd on 2016/12/3.
 */
@Controller
public class ErrorController extends BaseController {

    @RequestMapping("error")
    @ResponseBody
    public String error(){
        return String.format("{\"errorMsg\":\"%s\",\"errorCode\":%d}","Server error:",0);
    }

}
