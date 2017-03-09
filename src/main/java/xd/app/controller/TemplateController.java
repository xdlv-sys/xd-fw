package xd.app.controller;

import org.springframework.stereotype.Controller;
import xd.fw.controller.BaseController;
import xd.fw.util.FwException;
import xd.fw.util.I18n;

import javax.annotation.PostConstruct;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by xd on 3/9/2017.
 */
@Controller
public abstract class TemplateController extends BaseController {

    protected File templateFile(Date belong, Integer deptId, String fileName){

        File dir = new File (I18n.getWebInfDir(), relativeTemplatePath(belong, deptId));
        if (!dir.exists() && !dir.mkdirs()){
            throw new FwException("can not create dir for template files");
        }
        return new File(dir, fileName);
    }
    protected String relativeTemplatePath(Date belong, Integer deptId){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        return String.format("template-files/%s/%d/", sdf.format(belong), deptId);
    }

}
