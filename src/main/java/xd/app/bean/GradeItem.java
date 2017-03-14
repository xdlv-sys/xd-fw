package xd.app.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by xd on 3/14/2017.
 */
@Entity
@Table(name = "t_grade_item")
public class GradeItem {
    @Id
    @TableGenerator(name = "GradeItem")
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "GradeItem")
    private Integer id;
    private Double selfScore;
    private Double score;
    private Integer level;
    private Double ratio;
    private Timestamp uploadTime;
    @ManyToOne
    @JoinColumn(name = "grade_id")
    @JsonIgnore
    private Grade grade;

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getSelfScore() {
        return selfScore;
    }

    public void setSelfScore(Double selfScore) {
        this.selfScore = selfScore;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Double getRatio() {
        return ratio;
    }

    public void setRatio(Double ratio) {
        this.ratio = ratio;
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

        GradeItem gradeItem = (GradeItem) o;

        if (id != null ? !id.equals(gradeItem.id) : gradeItem.id != null) return false;
        if (selfScore != null ? !selfScore.equals(gradeItem.selfScore) : gradeItem.selfScore != null) return false;
        if (score != null ? !score.equals(gradeItem.score) : gradeItem.score != null) return false;
        if (level != null ? !level.equals(gradeItem.level) : gradeItem.level != null) return false;
        if (ratio != null ? !ratio.equals(gradeItem.ratio) : gradeItem.ratio != null) return false;
        if (uploadTime != null ? !uploadTime.equals(gradeItem.uploadTime) : gradeItem.uploadTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (selfScore != null ? selfScore.hashCode() : 0);
        result = 31 * result + (score != null ? score.hashCode() : 0);
        result = 31 * result + (level != null ? level.hashCode() : 0);
        result = 31 * result + (ratio != null ? ratio.hashCode() : 0);
        result = 31 * result + (uploadTime != null ? uploadTime.hashCode() : 0);
        return result;
    }
}
