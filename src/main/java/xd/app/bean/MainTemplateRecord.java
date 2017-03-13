package xd.app.bean;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * Created by xd on 3/8/2017.
 */
@Entity
@Table(name = "t_main_template_record")
public class MainTemplateRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE,generator = "MainTemplateRecord")
    @TableGenerator(name = "MainTemplateRecord")
    private Integer id;
    private Date belong;
    private Byte genre;
    private Byte status;
    private Integer deptId;
    private String creator;
    private String comments;
    private Timestamp createTime;

    @OneToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER, mappedBy = "record")
    List<MainTemplate> templates;

    public List<MainTemplate> getTemplates() {
        return templates;
    }

    public void setTemplates(List<MainTemplate> templates) {
        this.templates = templates;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
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

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Byte getGenre() {
        return genre;
    }

    public void setGenre(Byte genre) {
        this.genre = genre;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MainTemplateRecord that = (MainTemplateRecord) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (belong != null ? !belong.equals(that.belong) : that.belong != null) return false;
        if (genre != null ? !genre.equals(that.genre) : that.genre != null) return false;
        if (status != null ? !status.equals(that.status) : that.status != null) return false;
        if (creator != null ? !creator.equals(that.creator) : that.creator != null) return false;
        if (createTime != null ? !createTime.equals(that.createTime) : that.createTime != null) return false;
        return templates != null ? templates.equals(that.templates) : that.templates == null;

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (belong != null ? belong.hashCode() : 0);
        result = 31 * result + (genre != null ? genre.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (creator != null ? creator.hashCode() : 0);
        result = 31 * result + (createTime != null ? createTime.hashCode() : 0);
        result = 31 * result + (templates != null ? templates.hashCode() : 0);
        return result;
    }
}
