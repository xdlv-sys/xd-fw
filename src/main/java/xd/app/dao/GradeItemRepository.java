package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.GradeItem;

public interface GradeItemRepository extends JpaRepository<GradeItem, Integer> {
}