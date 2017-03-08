package xd.app.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;

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
    private Integer deptId;
    private Integer downloadTimes;
    private String fileName;
    private Timestamp uploadTime;
    @ManyToOne
    @JoinColumn(name = "record_id")
    @JsonIgnore
    MainTemplateRecord record;

    public MainTemplateRecord getRecord() {
        return record;
    }

    public void setRecord(MainTemplateRecord record) {
        this.record = record;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MainTemplate that = (MainTemplate) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (deptId != null ? !deptId.equals(that.deptId) : that.deptId != null) return false;
        if (downloadTimes != null ? !downloadTimes.equals(that.downloadTimes) : that.downloadTimes != null)
            return false;
        if (fileName != null ? !fileName.equals(that.fileName) : that.fileName != null) return false;
        if (uploadTime != null ? !uploadTime.equals(that.uploadTime) : that.uploadTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (deptId != null ? deptId.hashCode() : 0);
        result = 31 * result + (downloadTimes != null ? downloadTimes.hashCode() : 0);
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (uploadTime != null ? uploadTime.hashCode() : 0);
        return result;
    }
}
