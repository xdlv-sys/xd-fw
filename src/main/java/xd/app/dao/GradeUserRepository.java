package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.GradeUser;
import xd.fw.bean.DynamicConf;

public interface GradeUserRepository extends JpaRepository<GradeUser, Integer> {
}