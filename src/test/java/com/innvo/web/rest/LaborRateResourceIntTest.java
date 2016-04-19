package com.innvo.web.rest;

import com.innvo.JetsApp;
import com.innvo.domain.LaborRate;
import com.innvo.repository.LaborRateRepository;
import com.innvo.repository.search.LaborRateSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.innvo.domain.enumeration.LaborCategory;

/**
 * Test class for the LaborRateResource REST controller.
 *
 * @see LaborRateResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = JetsApp.class)
@WebAppConfiguration
@IntegrationTest
public class LaborRateResourceIntTest {


    private static final Long DEFAULT_RATE_PER_HOUR = 999L;
    private static final Long UPDATED_RATE_PER_HOUR = 998L;

    private static final LaborCategory DEFAULT_LABOR_CATEGORY = LaborCategory.Category_One;
    private static final LaborCategory UPDATED_LABOR_CATEGORY = LaborCategory.Category_Two;

    @Inject
    private LaborRateRepository laborRateRepository;

    @Inject
    private LaborRateSearchRepository laborRateSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restLaborRateMockMvc;

    private LaborRate laborRate;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        LaborRateResource laborRateResource = new LaborRateResource();
        ReflectionTestUtils.setField(laborRateResource, "laborRateSearchRepository", laborRateSearchRepository);
        ReflectionTestUtils.setField(laborRateResource, "laborRateRepository", laborRateRepository);
        this.restLaborRateMockMvc = MockMvcBuilders.standaloneSetup(laborRateResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        laborRateSearchRepository.deleteAll();
        laborRate = new LaborRate();
        laborRate.setRatePerHour(DEFAULT_RATE_PER_HOUR);
        laborRate.setLaborCategory(DEFAULT_LABOR_CATEGORY);
    }

    @Test
    @Transactional
    public void createLaborRate() throws Exception {
        int databaseSizeBeforeCreate = laborRateRepository.findAll().size();

        // Create the LaborRate

        restLaborRateMockMvc.perform(post("/api/labor-rates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(laborRate)))
                .andExpect(status().isCreated());

        // Validate the LaborRate in the database
        List<LaborRate> laborRates = laborRateRepository.findAll();
        assertThat(laborRates).hasSize(databaseSizeBeforeCreate + 1);
        LaborRate testLaborRate = laborRates.get(laborRates.size() - 1);
        assertThat(testLaborRate.getRatePerHour()).isEqualTo(DEFAULT_RATE_PER_HOUR);
        assertThat(testLaborRate.getLaborCategory()).isEqualTo(DEFAULT_LABOR_CATEGORY);

        // Validate the LaborRate in ElasticSearch
        LaborRate laborRateEs = laborRateSearchRepository.findOne(testLaborRate.getId());
        assertThat(laborRateEs).isEqualToComparingFieldByField(testLaborRate);
    }

    @Test
    @Transactional
    public void checkRatePerHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = laborRateRepository.findAll().size();
        // set the field null
        laborRate.setRatePerHour(null);

        // Create the LaborRate, which fails.

        restLaborRateMockMvc.perform(post("/api/labor-rates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(laborRate)))
                .andExpect(status().isBadRequest());

        List<LaborRate> laborRates = laborRateRepository.findAll();
        assertThat(laborRates).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLaborCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = laborRateRepository.findAll().size();
        // set the field null
        laborRate.setLaborCategory(null);

        // Create the LaborRate, which fails.

        restLaborRateMockMvc.perform(post("/api/labor-rates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(laborRate)))
                .andExpect(status().isBadRequest());

        List<LaborRate> laborRates = laborRateRepository.findAll();
        assertThat(laborRates).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLaborRates() throws Exception {
        // Initialize the database
        laborRateRepository.saveAndFlush(laborRate);

        // Get all the laborRates
        restLaborRateMockMvc.perform(get("/api/labor-rates?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(laborRate.getId().intValue())))
                .andExpect(jsonPath("$.[*].ratePerHour").value(hasItem(DEFAULT_RATE_PER_HOUR.intValue())))
                .andExpect(jsonPath("$.[*].laborCategory").value(hasItem(DEFAULT_LABOR_CATEGORY.toString())));
    }

    @Test
    @Transactional
    public void getLaborRate() throws Exception {
        // Initialize the database
        laborRateRepository.saveAndFlush(laborRate);

        // Get the laborRate
        restLaborRateMockMvc.perform(get("/api/labor-rates/{id}", laborRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(laborRate.getId().intValue()))
            .andExpect(jsonPath("$.ratePerHour").value(DEFAULT_RATE_PER_HOUR.intValue()))
            .andExpect(jsonPath("$.laborCategory").value(DEFAULT_LABOR_CATEGORY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLaborRate() throws Exception {
        // Get the laborRate
        restLaborRateMockMvc.perform(get("/api/labor-rates/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLaborRate() throws Exception {
        // Initialize the database
        laborRateRepository.saveAndFlush(laborRate);
        laborRateSearchRepository.save(laborRate);
        int databaseSizeBeforeUpdate = laborRateRepository.findAll().size();

        // Update the laborRate
        LaborRate updatedLaborRate = new LaborRate();
        updatedLaborRate.setId(laborRate.getId());
        updatedLaborRate.setRatePerHour(UPDATED_RATE_PER_HOUR);
        updatedLaborRate.setLaborCategory(UPDATED_LABOR_CATEGORY);

        restLaborRateMockMvc.perform(put("/api/labor-rates")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedLaborRate)))
                .andExpect(status().isOk());

        // Validate the LaborRate in the database
        List<LaborRate> laborRates = laborRateRepository.findAll();
        assertThat(laborRates).hasSize(databaseSizeBeforeUpdate);
        LaborRate testLaborRate = laborRates.get(laborRates.size() - 1);
        assertThat(testLaborRate.getRatePerHour()).isEqualTo(UPDATED_RATE_PER_HOUR);
        assertThat(testLaborRate.getLaborCategory()).isEqualTo(UPDATED_LABOR_CATEGORY);

        // Validate the LaborRate in ElasticSearch
        LaborRate laborRateEs = laborRateSearchRepository.findOne(testLaborRate.getId());
        assertThat(laborRateEs).isEqualToComparingFieldByField(testLaborRate);
    }

    @Test
    @Transactional
    public void deleteLaborRate() throws Exception {
        // Initialize the database
        laborRateRepository.saveAndFlush(laborRate);
        laborRateSearchRepository.save(laborRate);
        int databaseSizeBeforeDelete = laborRateRepository.findAll().size();

        // Get the laborRate
        restLaborRateMockMvc.perform(delete("/api/labor-rates/{id}", laborRate.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean laborRateExistsInEs = laborRateSearchRepository.exists(laborRate.getId());
        assertThat(laborRateExistsInEs).isFalse();

        // Validate the database is empty
        List<LaborRate> laborRates = laborRateRepository.findAll();
        assertThat(laborRates).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchLaborRate() throws Exception {
        // Initialize the database
        laborRateRepository.saveAndFlush(laborRate);
        laborRateSearchRepository.save(laborRate);

        // Search the laborRate
        restLaborRateMockMvc.perform(get("/api/_search/labor-rates?query=id:" + laborRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(laborRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].ratePerHour").value(hasItem(DEFAULT_RATE_PER_HOUR.intValue())))
            .andExpect(jsonPath("$.[*].laborCategory").value(hasItem(DEFAULT_LABOR_CATEGORY.toString())));
    }
}
