package xd.fw.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import xd.fw.bean.User;
import xd.fw.dao.UserRepositoryCustom;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by xd on 2016/11/30.
 */
public abstract class BaseController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    UserRepositoryCustom userRepositoryCustom;

    protected final String DONE = "{\"success\":true}";

    protected PageContent page(Page<?> data) {
        return new PageContent(data);
    }

    protected PageContent page(List<?> data) {
        return new PageContent(data);
    }

    protected PageRequest pageRequest(int page, int limit) {
        return new PageRequest(page - 1, limit);
    }
    protected PageRequest pageRequest(int page, int limit, Sort sort) {
        return new PageRequest(page - 1, limit, sort);
    }

    protected ModelRequest modelRequest(Object obj) {
        return new ModelRequest(obj);
    }

    static class ModelRequest {
        Object data;

        ModelRequest(Object data) {
            this.data = data;
        }

        public Object getData() {
            return data;
        }
    }

    static class PageContent extends ModelRequest {
        long total;

        PageContent(Page<?> data) {
            super(data.getContent());
            this.total = data.getTotalElements();
        }

        PageContent(List<?> data) {
            super(data);
            this.total = data == null ? 0 : data.size();
        }

        public long getTotal() {
            return total;
        }
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    protected ExampleMatcher queryMatcher(){
        return ExampleMatcher.matching().withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);
    }

    enum BROWSER {IE, FIREFOX, CHROME}

    public static BROWSER getBrowser(HttpServletRequest request) {
        String userAgent = request.getHeader("USER-AGENT");
        if (StringUtils.isBlank(userAgent)) {
            return BROWSER.IE;
        }
        if (userAgent.contains("Chrome")) {
            return BROWSER.CHROME;
        }
        if (userAgent.contains("Firefox")) {
            return BROWSER.FIREFOX;
        }
        return BROWSER.IE;
    }

    public static String writeDownloadFile(HttpServletRequest request, String fileName) throws UnsupportedEncodingException {
        if (getBrowser(request) == BROWSER.IE) {
            fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
            fileName = StringUtils.replace(fileName, "+", "%20");
        } else {
            fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
        }
        return fileName;
    }
}
