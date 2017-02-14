package xd.fw.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.fw.bean.Mod;
import xd.fw.bean.Role;

public interface ModRepository extends JpaRepository<Mod, Integer> {
}