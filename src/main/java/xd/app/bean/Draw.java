package xd.app.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by xd on 2/15/2017.
 */
@Entity
@Table(name = "t_draw")
public class Draw {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "Draw")
    @TableGenerator(name = "Draw")
    private Integer id;
    private String name;
    private Long duration;
    private Byte reset;
    private String conf;
    private Integer userId;
    private Timestamp createTime;
    private Byte froala;

    @OneToMany(cascade = CascadeType.ALL,fetch=FetchType.LAZY,mappedBy = "draw")
    @JsonIgnore
    List<DrawItem> items;

    public List<DrawItem> getItems() {
        return items;
    }

    public void setItems(List<DrawItem> items) {
        this.items = items;
    }

    public Byte getFroala() {
        return froala;
    }

    public void setFroala(Byte froala) {
        this.froala = froala;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getConf() {
        return conf;
    }

    public void setConf(String conf) {
        this.conf = conf;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Byte getReset() {
        return reset;
    }

    public void setReset(Byte reset) {
        this.reset = reset;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Draw draw = (Draw) o;

        if (id != null ? !id.equals(draw.id) : draw.id != null) return false;
        if (name != null ? !name.equals(draw.name) : draw.name != null) return false;
        if (conf != null ? !conf.equals(draw.conf) : draw.conf != null) return false;
        if (userId != null ? !userId.equals(draw.userId) : draw.userId != null) return false;
        if (createTime != null ? !createTime.equals(draw.createTime) : draw.createTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (conf != null ? conf.hashCode() : 0);
        result = 31 * result + (userId != null ? userId.hashCode() : 0);
        result = 31 * result + (createTime != null ? createTime.hashCode() : 0);
        return result;
    }
}
