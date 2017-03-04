package xd.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import xd.app.bean.Draw;
import xd.app.bean.DrawItem;
import xd.app.dao.DrawItemRepository;
import xd.app.dao.DrawRepository;
import xd.fw.controller.BaseController;
import xd.fw.util.FwException;
import xd.fw.util.I18n;

import java.io.File;
import java.util.Arrays;
import java.util.UUID;

/**
 * Created by xd on 2/15/2017.
 */
@Controller
@RequestMapping("drawItem")
public class DrawItemController extends BaseController {
    @Autowired
    DrawRepository drawRepository;
    @Autowired
    DrawItemRepository drawItemRepository;

    @RequestMapping("addDrawItem")
    @ResponseBody
    public String addDrawItem(int drawId, DrawItem item) throws Exception {
        fwService.runSessionCommit(() -> {
            Draw draw = drawRepository.findOne(drawId);
            item.setDraw(draw);
            drawItemRepository.save(item);
        });
        return DONE;
    }
    @RequestMapping("submitScore")
    @ResponseBody
    public String submitScore(int drawItemId, int heart, int star) throws Exception {
        fwService.runSessionCommit(() -> {
            DrawItem item = drawItemRepository.findOne(drawItemId);
            item.setHeart(item.getHeart() + heart);
            item.setStar(item.getStar() + star);
            drawItemRepository.save(item);
        });
        return DONE;
    }

    @RequestMapping("deleteDrawItems")
    @ResponseBody
    public String deleteDraws(int[] drawItemIds) throws Exception {
        Arrays.stream(drawItemIds).forEach(id -> drawItemRepository.delete(id));
        return DONE;
    }

    @RequestMapping("obtainDrawItems")
    @ResponseBody
    public PageContent obtainDrawItems(int drawId, int page, int limit){
        Page<DrawItem> list = drawItemRepository.findByDrawId(drawId,pageRequest(page, limit));
        return page(list);
    }

    @RequestMapping("uploadImage")
    @ResponseBody
    public String uploadImage(MultipartFile file) throws Exception {
        File dest = new File(I18n.getWebInfDir().getParentFile(), "upload");
        if (!dest.exists() && !dest.mkdirs()) {
            throw new FwException("can not create directory for upload file");
        }
        String name = UUID.randomUUID().toString() + file.getOriginalFilename();
        file.transferTo(new File(dest, name));
        //I18n.getWebInfDir()
        return String.format("{\"link\":\"%s\"}", "../upload/" + name);
    }
}
