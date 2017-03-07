package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.MainTemplate;

public interface MainTemplateRepository extends JpaRepository<MainTemplate, Integer> {
}