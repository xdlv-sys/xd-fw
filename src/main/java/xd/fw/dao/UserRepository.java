package xd.fw.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.fw.bean.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByName(String name);
}