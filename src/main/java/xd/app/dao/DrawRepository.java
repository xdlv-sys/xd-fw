package xd.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import xd.app.bean.Draw;

public interface DrawRepository extends JpaRepository<Draw, Integer> {
}