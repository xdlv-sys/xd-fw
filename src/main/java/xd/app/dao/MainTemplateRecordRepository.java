package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.MainTemplateRecord;

public interface MainTemplateRecordRepository extends JpaRepository<MainTemplateRecord, Integer> {
}