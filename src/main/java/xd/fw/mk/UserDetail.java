package xd.fw.mk;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Created by xd on 2016/12/7.
 */
public class UserDetail extends User {
    xd.fw.bean.User user;
    public UserDetail(String username, String password
            , Collection<? extends GrantedAuthority> authorities,xd.fw.bean.User user) {
        super(username, password, authorities);
        this.user = user;
    }

    public xd.fw.bean.User getUser() {
        return user;
    }
}
