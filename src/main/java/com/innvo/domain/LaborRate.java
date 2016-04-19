package com.innvo.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.innvo.domain.enumeration.LaborCategory;

/**
 * A LaborRate.
 */
@Entity
@Table(name = "labor_rate")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "laborrate")
public class LaborRate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Max(value = 999)
    @Column(name = "rate_per_hour", nullable = false)
    private Long ratePerHour;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "labor_category", nullable = false)
    private LaborCategory laborCategory;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRatePerHour() {
        return ratePerHour;
    }

    public void setRatePerHour(Long ratePerHour) {
        this.ratePerHour = ratePerHour;
    }

    public LaborCategory getLaborCategory() {
        return laborCategory;
    }

    public void setLaborCategory(LaborCategory laborCategory) {
        this.laborCategory = laborCategory;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LaborRate laborRate = (LaborRate) o;
        if(laborRate.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, laborRate.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "LaborRate{" +
            "id=" + id +
            ", ratePerHour='" + ratePerHour + "'" +
            ", laborCategory='" + laborCategory + "'" +
            '}';
    }
}
