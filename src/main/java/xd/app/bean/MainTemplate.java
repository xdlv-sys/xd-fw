package xd.app.bean;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

/**
 * Created by xd on 3/7/2017.
 */
@Entity
@Table(name = "t_main_template")
public class MainTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "MainTemplate")
    @TableGenerator(name = "MainTemplate")
    private Integer id;
    private Date belong;
    private Integer deptId;
    private Integer downloadTimes;
    private String fileName;
    private Timestamp uploadTime;
    private String creator;

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

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
    }

    public Integer getDownloadTimes() {
        return downloadTimes;
    }

    public void setDownloadTimes(Integer downloadTimes) {
        this.downloadTimes = downloadTimes;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Timestamp getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Timestamp uploadTime) {
        this.uploadTime = uploadTime;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MainTemplate that = (MainTemplate) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (belong != null ? !belong.equals(that.belong) : that.belong != null) return false;
        if (deptId != null ? !deptId.equals(that.deptId) : that.deptId != null) return false;
        if (downloadTimes != null ? !downloadTimes.equals(that.downloadTimes) : that.downloadTimes != null)
            return false;
        if (fileName != null ? !fileName.equals(that.fileName) : that.fileName != null) return false;
        if (uploadTime != null ? !uploadTime.equals(that.uploadTime) : that.uploadTime != null) return false;
        if (creator != null ? !creator.equals(that.creator) : that.creator != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (belong != null ? belong.hashCode() : 0);
        result = 31 * result + (deptId != null ? deptId.hashCode() : 0);
        result = 31 * result + (downloadTimes != null ? downloadTimes.hashCode() : 0);
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (uploadTime != null ? uploadTime.hashCode() : 0);
        result = 31 * result + (creator != null ? creator.hashCode() : 0);
        return result;
    }
}
