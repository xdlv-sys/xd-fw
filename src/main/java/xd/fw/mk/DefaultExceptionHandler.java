package xd.fw.mk;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import xd.fw.util.FwException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
public class DefaultExceptionHandler implements HandlerExceptionResolver {
    private static Logger log = LoggerFactory.getLogger(DefaultExceptionHandler.class);

    String errorMsg = "{\"success\":false,\"errorMsg\":\"%s\",\"errorCode\":%d}";

    public ModelAndView resolveException(HttpServletRequest request
            , HttpServletResponse response, Object handler, Exception ex) {
        ModelAndView mv = new ModelAndView();
        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache, must-revalidate");
        int errorCode = -1;
        if (ex instanceof FwException){
            errorCode = ((FwException) ex).getErrorCode();
            log.info("business failed:{}", ex.getMessage());
        } else {
            log.error("", ex);
        }
        try {
            response.getWriter().write(String.format(errorMsg,ex.getMessage(),errorCode));
        } catch (IOException e) {
            log.error("与客户端通讯异常:" + e.getMessage(), e);
        }
        return mv;
    }
}