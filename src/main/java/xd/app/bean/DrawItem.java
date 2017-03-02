package xd.app.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Created by xd on 2/15/2017.
 */
@Entity
@Table(name = "t_draw_item")
public class DrawItem {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "draw_item_id")
    @TableGenerator(name = "draw_item_id", table = "t_primary_key",
            pkColumnName = "table_name", valueColumnName = "current_id")
    private Integer id;
    private String name;
    private String content;
    private Integer heart = 0;
    private Integer star = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "draw_id")
    @JsonIgnore
    Draw draw;

    public Draw getDraw() {
        return draw;
    }

    public void setDraw(Draw draw) {
        this.draw = draw;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getHeart() {
        return heart;
    }

    public void setHeart(Integer heart) {
        this.heart = heart;
    }

    public Integer getStar() {
        return star;
    }

    public void setStar(Integer star) {
        this.star = star;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DrawItem drawItem = (DrawItem) o;

        if (id != null ? !id.equals(drawItem.id) : drawItem.id != null) return false;
        if (name != null ? !name.equals(drawItem.name) : drawItem.name != null) return false;
        if (content != null ? !content.equals(drawItem.content) : drawItem.content != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (content != null ? content.hashCode() : 0);
        return result;
    }
}
