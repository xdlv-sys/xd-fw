package xd.fw.mk;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractXlsxView;
import xd.fw.controller.BaseController;
import xd.fw.util.FwException;
import xd.fw.util.FwUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * Created by xd on 2016/12/21.
 * cache the template files to speed up downloading files
 */
public abstract class ExcelStreamView extends AbstractXlsxView {
    String templateFile;
    String fileName;
    public ExcelStreamView(String templateFile, String fileName){
        this.templateFile = templateFile;
        this.fileName = fileName;
    }

    @Override
    protected Workbook createWorkbook(Map<String, Object> model, HttpServletRequest request) {
        if (templateFile == null){
            return new SXSSFWorkbook();
        }
        try {
            return FwUtil.parseFile(getClass().getResourceAsStream(templateFile));
        } catch (Exception e) {
            throw new FwException("can not create template file", e);
        }
    }

    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("Content-Disposition", "attachment; filename="
                + BaseController.writeDownloadFile(request, fileName));
    }

    @Override
    protected void renderWorkbook(Workbook workbook, HttpServletResponse response) throws IOException {
        super.renderWorkbook(workbook, response);

        // Dispose of temporary files in case of streaming variant...
        if (workbook instanceof SXSSFWorkbook){
            ((SXSSFWorkbook) workbook).dispose();
        }

    }
}
