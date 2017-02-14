package xd.fw.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.fw.bean.Role;
import xd.fw.bean.User;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}