package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.Grade;

public interface GradeRepository extends JpaRepository<Grade, Integer> {
}