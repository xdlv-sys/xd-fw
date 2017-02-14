package xd.fw.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.fw.bean.Dept;

public interface DeptRepository extends JpaRepository<Dept, Integer> {
}