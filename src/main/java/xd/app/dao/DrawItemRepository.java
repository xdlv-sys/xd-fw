package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.DrawItem;

public interface DrawItemRepository extends JpaRepository<DrawItem, Integer> {
}