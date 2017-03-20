package xd.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;
import xd.app.AppConst;
import xd.fw.controller.BaseController;
import xd.fw.util.FwException;
import xd.fw.util.I18n;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by xd on 3/9/2017.
 */
@Controller
public abstract class TemplateController extends BaseController implements AppConst{

    protected Byte STATUS_PUSH = 1, STATUS_APPROVED_BY_HR = 2;

    protected File templateFile(Date belong, Integer deptId, Byte genre, String fileName){

        File dir = new File (I18n.getWebInfDir(), relativeTemplatePath(belong, deptId, genre));
        if (!dir.exists() && !dir.mkdirs()){
            throw new FwException("can not create dir for template files");
        }
        return new File(dir, fileName);
    }
    protected String relativeTemplatePath(Date belong, Integer deptId, Byte genre){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        return String.format("template-files/%s/%d/%d/", sdf.format(belong), deptId, genre);
    }

    protected void transfer(MultipartFile file, Date belong, Integer deptId, Byte genre) {
        try {
            file.transferTo(templateFile(belong, deptId, genre, file.getOriginalFilename()));
        } catch (IOException e) {
            throw new FwException("", e);
        }
    }

}
