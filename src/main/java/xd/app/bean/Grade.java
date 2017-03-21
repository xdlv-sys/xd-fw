package xd.app.bean;

import xd.fw.bean.Dept;

import javax.persistence.*;
import java.util.Date;
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
    private Byte status;
    private Date uploadTime;
    @OneToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER, mappedBy = "grade")
    List<GradeItem> items;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private GradeUser user;
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Dept dept;

    public Dept getDept() {
        return dept;
    }

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    public GradeUser getUser() {
        return user;
    }

    public void setUser(GradeUser user) {
        this.user = user;
    }

    public List<GradeItem> getItems() {
        return items;
    }

    public void setItems(List<GradeItem> items) {
        this.items = items;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
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

    public Date getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Date uploadTime) {
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
        if (uploadTime != null ? !uploadTime.equals(grade.uploadTime) : grade.uploadTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (belong != null ? belong.hashCode() : 0);
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (uploadTime != null ? uploadTime.hashCode() : 0);
        return result;
    }
}
