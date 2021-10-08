/**
* Test data for article creation functionality
 */
export const content_url= '/node/add/article';
export const node_url = '/node';
export const node_type= 'article';
export const article_json_title = 'E2E Testing with Cypress, Drupal & Json:API Module'
export const article_body =
	'<p>E2E Testing with Cypress and Drupal. In this session, we shall see,</p>' +
	'<ul>' +
	'<li>Show how Cypress tests are written for Drupal Application</li>' +
	'<li>Various User Role Creation and Deletion with Drush</li>' +
	'<li><strong>Good to know:</strong>Various Data Seeding Approaches</li>' +
	'</ul>' +
	'<p>&nbsp;</p>' +
	'<p>Materials used:</p>' +
	'<ul>' +
	'<li>https://docs.google.com/presentation/d/1VcQsR_Khuh9qg-0-LbPS6RnAwu6y3wKGdVimCg9hC8U/edit?usp=sharing</li>' +
	'<li>https://codesandbox.io/s/cypress-session-2-u542d</li>' +
	'</ul>';
export const format_type  = 'Basic HTML';
export const article_json_tag = 'Cypress-Drupal ' + Date.now();
export const save_btn_text = 'Save';
export const article_json_prim_attributes = {
	title: article_json_title,
	body: {
		value: article_json_title
	}
};
export const article_json_sec_taxonomy_attributes =
{
	field_tags: {
		data: {
			type: 'taxonomy_term--tags',
			id: 'uuid'
		}
	}
};
export const article_json_header_title = article_json_prim_attributes.title;
export const article_json_body_value = article_json_prim_attributes.title;
export const article_json_tag_attribute = {
	name: {
		value: article_json_tag
	}
};
export const language_codes = ['en', 'es'];