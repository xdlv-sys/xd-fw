package xd.fw.mk;

import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.config.http.FilterInvocationSecurityMetadataSourceParser;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Created by xd on 12/6/2016.
 */
@Service
public class EmptySecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
    List<ConfigAttribute> exe = Collections.singletonList(new SecurityConfig("EXE"));
    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        return exe;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return exe;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}
