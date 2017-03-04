package xd.app.controller;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import xd.app.bean.Draw;
import xd.app.bean.DrawItem;
import xd.app.dao.DrawItemRepository;
import xd.app.dao.DrawRepository;
import xd.fw.controller.BaseController;
import xd.fw.mk.ExcelStreamView;
import xd.fw.util.FwUtil;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by xd on 2/15/2017.
 */
@Controller
@RequestMapping("draw")
public class DrawController extends BaseController{
    @Autowired
    DrawRepository drawRepository;
    @Autowired
    DrawItemRepository drawItemRepository;

    @RequestMapping("obtainDraws")
    @ResponseBody
    public PageContent obtainDraws(Draw draw,int page, int limit){
        Page<Draw> list = drawRepository.findAll(Example.of(draw, queryMatcher()),pageRequest(page, limit));
        return page(list);
    }

    @RequestMapping("addDraw")
    @ResponseBody
    public String addDraw(MultipartFile file, Draw draw) throws Exception{
        Workbook wb = FwUtil.parseFile(file.getInputStream());
        Sheet sheet = wb.getSheetAt(0);
        Row row;
        Cell cell;
        String value;
        List<DrawItem> items = new ArrayList<>();
        for (int i = 2;;i++){
            row = sheet.getRow(i);
            if (row == null || (cell = row.getCell(1))  == null
                    || StringUtils.isEmpty((value = cell.getStringCellValue()))){
                break;
            }
            DrawItem item =  new DrawItem();
            item.setContent(value);
            items.add(item);
        }

        Draw drawRecord = drawRepository.save(draw);
        items.forEach(item -> {
            item.setDraw(drawRecord);
            drawItemRepository.save(item);
        });

        return DONE;
    }

    @RequestMapping("deleteDraws")
    @ResponseBody
    public String deleteDraws(int[] drawIds) throws Exception{
        Arrays.stream(drawIds).forEach(id->drawRepository.delete(id));
        return DONE;
    }

    @RequestMapping("downloadTemplate")
    @ResponseBody
    public ModelAndView downloadTemplate() throws Exception{
        return new ModelAndView(new ExcelStreamView("/draw.xlsx", "template.xlsx"){});
    }
}
