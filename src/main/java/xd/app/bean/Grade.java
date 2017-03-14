package xd.app.bean;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by xd on 3/14/2017.
 */
@Entity
@Table(name = "t_grade")
public class Grade {
    @Id
    @TableGenerator(name = "Grade")
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "Grade")
    private Integer id;
    private Date belong;
    private String fileName;
    private Integer creatorId;
    private Timestamp uploadTime;
    @OneToMany
    @JoinColumn(name = "creator_id")
    List<GradeItem> items;

    public List<GradeItem> getItems() {
        return items;
    }

    public void setItems(List<GradeItem> items) {
        this.items = items;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getBelong() {
        return belong;
    }

    public void setBelong(Date belong) {
        this.belong = belong;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public Timestamp getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Timestamp uploadTime) {
        this.uploadTime = uploadTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Grade grade = (Grade) o;

        if (id != null ? !id.equals(grade.id) : grade.id != null) return false;
        if (belong != null ? !belong.equals(grade.belong) : grade.belong != null) return false;
        if (fileName != null ? !fileName.equals(grade.fileName) : grade.fileName != null) return false;
        if (creatorId != null ? !creatorId.equals(grade.creatorId) : grade.creatorId != null) return false;
        if (uploadTime != null ? !uploadTime.equals(grade.uploadTime) : grade.uploadTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (belong != null ? belong.hashCode() : 0);
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (creatorId != null ? creatorId.hashCode() : 0);
        result = 31 * result + (uploadTime != null ? uploadTime.hashCode() : 0);
        return result;
    }
}
