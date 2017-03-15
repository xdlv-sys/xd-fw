package xd.app.bean;

import xd.fw.bean.User;

import javax.persistence.*;

/**
 * Created by xd on 2017/3/5.
 */
@Entity
@Table(name = "t_grade_user")
public class GradeUser{
    @Id
    private Integer id;
    private Integer organization;
    private String fullName;
    private String code;
    private String location;
    private Integer category;
    private String jobName;
    private Integer contractType;
    private Integer inService;
    private Integer leader;

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name="id")
    private User user;

    public Integer getLeader() {
        return leader;
    }

    public void setLeader(Integer leader) {
        this.leader = leader;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getOrganization() {
        return organization;
    }

    public void setOrganization(Integer organization) {
        this.organization = organization;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public Integer getContractType() {
        return contractType;
    }

    public void setContractType(Integer contractType) {
        this.contractType = contractType;
    }

    public Integer getInService() {
        return inService;
    }

    public void setInService(Integer inService) {
        this.inService = inService;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        GradeUser gradeUser = (GradeUser) o;

        if (id != null ? !id.equals(gradeUser.id) : gradeUser.id != null) return false;
        if (organization != null ? !organization.equals(gradeUser.organization) : gradeUser.organization != null)
            return false;
        if (code != null ? !code.equals(gradeUser.code) : gradeUser.code != null) return false;
        if (location != null ? !location.equals(gradeUser.location) : gradeUser.location != null) return false;
        if (category != null ? !category.equals(gradeUser.category) : gradeUser.category != null) return false;
        if (jobName != null ? !jobName.equals(gradeUser.jobName) : gradeUser.jobName != null) return false;
        if (contractType != null ? !contractType.equals(gradeUser.contractType) : gradeUser.contractType != null)
            return false;
        return inService != null ? inService.equals(gradeUser.inService) : gradeUser.inService == null;

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (organization != null ? organization.hashCode() : 0);
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (location != null ? location.hashCode() : 0);
        result = 31 * result + (category != null ? category.hashCode() : 0);
        result = 31 * result + (jobName != null ? jobName.hashCode() : 0);
        result = 31 * result + (contractType != null ? contractType.hashCode() : 0);
        result = 31 * result + (inService != null ? inService.hashCode() : 0);
        return result;
    }
}
