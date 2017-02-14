package xd.fw.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.fw.bean.DynamicConf;

public interface ConfRepository extends JpaRepository<DynamicConf, Integer> {
}