package com.innvo.web.rest;

import com.innvo.JetsApp;
import com.innvo.domain.Worklog;
import com.innvo.repository.WorklogRepository;
import com.innvo.repository.search.WorklogSearchRepository;

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


/**
 * Test class for the WorklogResource REST controller.
 *
 * @see WorklogResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = JetsApp.class)
@WebAppConfiguration
@IntegrationTest
public class WorklogResourceIntTest {


    private static final Long DEFAULT_HOURS = 24L;
    private static final Long UPDATED_HOURS = 23L;

    @Inject
    private WorklogRepository worklogRepository;

    @Inject
    private WorklogSearchRepository worklogSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restWorklogMockMvc;

    private Worklog worklog;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        WorklogResource worklogResource = new WorklogResource();
        ReflectionTestUtils.setField(worklogResource, "worklogSearchRepository", worklogSearchRepository);
        ReflectionTestUtils.setField(worklogResource, "worklogRepository", worklogRepository);
        this.restWorklogMockMvc = MockMvcBuilders.standaloneSetup(worklogResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        worklogSearchRepository.deleteAll();
        worklog = new Worklog();
        worklog.setHours(DEFAULT_HOURS);
    }

    @Test
    @Transactional
    public void createWorklog() throws Exception {
        int databaseSizeBeforeCreate = worklogRepository.findAll().size();

        // Create the Worklog

        restWorklogMockMvc.perform(post("/api/worklogs")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(worklog)))
                .andExpect(status().isCreated());

        // Validate the Worklog in the database
        List<Worklog> worklogs = worklogRepository.findAll();
        assertThat(worklogs).hasSize(databaseSizeBeforeCreate + 1);
        Worklog testWorklog = worklogs.get(worklogs.size() - 1);
        assertThat(testWorklog.getHours()).isEqualTo(DEFAULT_HOURS);

        // Validate the Worklog in ElasticSearch
        Worklog worklogEs = worklogSearchRepository.findOne(testWorklog.getId());
        assertThat(worklogEs).isEqualToComparingFieldByField(testWorklog);
    }

    @Test
    @Transactional
    public void getAllWorklogs() throws Exception {
        // Initialize the database
        worklogRepository.saveAndFlush(worklog);

        // Get all the worklogs
        restWorklogMockMvc.perform(get("/api/worklogs?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(worklog.getId().intValue())))
                .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS.intValue())));
    }

    @Test
    @Transactional
    public void getWorklog() throws Exception {
        // Initialize the database
        worklogRepository.saveAndFlush(worklog);

        // Get the worklog
        restWorklogMockMvc.perform(get("/api/worklogs/{id}", worklog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(worklog.getId().intValue()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingWorklog() throws Exception {
        // Get the worklog
        restWorklogMockMvc.perform(get("/api/worklogs/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorklog() throws Exception {
        // Initialize the database
        worklogRepository.saveAndFlush(worklog);
        worklogSearchRepository.save(worklog);
        int databaseSizeBeforeUpdate = worklogRepository.findAll().size();

        // Update the worklog
        Worklog updatedWorklog = new Worklog();
        updatedWorklog.setId(worklog.getId());
        updatedWorklog.setHours(UPDATED_HOURS);

        restWorklogMockMvc.perform(put("/api/worklogs")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedWorklog)))
                .andExpect(status().isOk());

        // Validate the Worklog in the database
        List<Worklog> worklogs = worklogRepository.findAll();
        assertThat(worklogs).hasSize(databaseSizeBeforeUpdate);
        Worklog testWorklog = worklogs.get(worklogs.size() - 1);
        assertThat(testWorklog.getHours()).isEqualTo(UPDATED_HOURS);

        // Validate the Worklog in ElasticSearch
        Worklog worklogEs = worklogSearchRepository.findOne(testWorklog.getId());
        assertThat(worklogEs).isEqualToComparingFieldByField(testWorklog);
    }

    @Test
    @Transactional
    public void deleteWorklog() throws Exception {
        // Initialize the database
        worklogRepository.saveAndFlush(worklog);
        worklogSearchRepository.save(worklog);
        int databaseSizeBeforeDelete = worklogRepository.findAll().size();

        // Get the worklog
        restWorklogMockMvc.perform(delete("/api/worklogs/{id}", worklog.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean worklogExistsInEs = worklogSearchRepository.exists(worklog.getId());
        assertThat(worklogExistsInEs).isFalse();

        // Validate the database is empty
        List<Worklog> worklogs = worklogRepository.findAll();
        assertThat(worklogs).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchWorklog() throws Exception {
        // Initialize the database
        worklogRepository.saveAndFlush(worklog);
        worklogSearchRepository.save(worklog);

        // Search the worklog
        restWorklogMockMvc.perform(get("/api/_search/worklogs?query=id:" + worklog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(worklog.getId().intValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS.intValue())));
    }
}
