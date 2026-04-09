export type Lang = 'en' | 'zh';

export interface Dict {
  /* ── Global / Nav ─────────────────────────────────── */
  nav: {
    home:         string;
    engine:       string;
    solutions:    string;
    science:      string;
    enterprise:   string;
    access:       string;
    langLabel:    string; // label for the OTHER language (click to switch)
  };

  /* ── Home — Hero ──────────────────────────────────── */
  hero: {
    badge:          string;
    chrono_label:   string;
    bio_label:      string;
    tooltip_title:  string;
    headline1:      string;
    headline2:      string;
    sub:            string;
    btn_engine:     string;
    btn_demo:       string;
    footnote:       string;
  };

  /* ── Home — Paradigm ──────────────────────────────── */
  paradigm: {
    section_label:  string;
    headline:       string;
    left_title:     string;
    left_sub:       string;
    right_title:    string;
    right_sub:      string;
    left_items:     string[];
    right_items:    string[];
    btn:            string;
  };

  /* ── Home — CTA ───────────────────────────────────── */
  cta: {
    section_label:  string;
    headline1:      string;
    headline2:      string;
    sub:            string;
    btn_engine:     string;
    btn_demo:       string;
    footnote:       string;
  };

  /* ── Engine ───────────────────────────────────────── */
  engine: {
    badge:            string;
    status:           string;
    headline:         string;
    sub:              string;
    label_age:        string;
    label_target:     string;
    label_gender:     string;
    opt_male:         string;
    opt_female:       string;
    opt_other:        string;
    btn_run:          string;
    btn_loading:      string;
    result_label:     string;
    result_delta:     string; // e.g. "younger than chronological"
    result_plan:      string;
    btn_solutions:    string;
    btn_reset:        string;
    stats_bio:        string;
    stats_chrono:     string;
    stats_delta:      string;
    error_failed:     string;
  };

  /* ── Solutions ────────────────────────────────────── */
  solutions: {
    hero_badge:       string;
    hero_headline:    string;
    hero_sub:         string;
    grid_label:       string;
    grid_headline:    string;
    grid_source:      string;
    cta_label:        string;
    cta_headline:     string;
    cta_sub:          string;
    btn_export:       string;
    btn_api:          string;
    stat_citations:   string;
    stat_pathways:    string;
    stat_compile:     string;
    stat_affil:       string;
    methodology_note: string;
  };

  /* ── Science ──────────────────────────────────────── */
  science: {
    badge:            string;
    headline:         string;
    sub:              string;
    sub2:             string;
    pillars_label:    string;
    pipeline_label:   string;
    pipeline_headline: string;
    cta_headline:     string;
    cta_sub:          string;
    btn_engine:       string;
    btn_enterprise:   string;
    pillars:          Array<{
      title: string;
      body:  string;
      refs:  string;
    }>;
    pipeline_steps:   Array<{ label: string; desc: string }>;
  };

  /* ── Enterprise ───────────────────────────────────── */
  enterprise: {
    badge:            string;
    headline:         string;
    headline_accent:  string;
    sub:              string;
    tiers_label:      string;
    integrators_label: string;
    cta_label:        string;
    cta_headline:     string;
    cta_sub:          string;
    btn_request:      string;
    btn_science:      string;
    modal_badge:      string;
    modal_headline:   string;
    modal_sub:        string;
    modal_contact_label: string;
    modal_contact_detail: string;
    modal_close:      string;
    services:         Array<{
      tag:   string;
      title: string;
      body:  string;
    }>;
    integrators:      string[];
  };
}
