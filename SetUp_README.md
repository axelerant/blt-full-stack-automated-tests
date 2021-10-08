## Getting Started

This project is based on BLT, an open-source project template and tool that enables building, testing, and deploying Drupal installations following acquia professional services best practices.

1. Review the [required / recommended skills](https://docs.acquia.com/blt/developer/skills) for working with a BLT project. **Note: Php version=7.3 is advisable**. Please downgrade/upgrade your current Php version by referring [this](https://getgrav.org/blog/macos-bigsur-apache-multiple-php-versions)

2. Ensure that your computer meets the minimum installation requirements by referring [this](https://docs.acquia.com/blt/install/).

3. Please install [Vagrant](https://www.vagrantup.com/downloads) and [Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads) softwares by referring this [Drupal VM](https://github.com/geerlingguy/drupal-vm) to build the drupal site in Virtual Machine. **Note: Drupal VM recommends latest versions of these: Vagrant 2.2.x, VirtualBox 6.1.x, Python >=3.8**. Please manage your current default python version(i.e, ```python --version```) by referring [this](https://stackoverflow.com/a/54570220)

4. Recommend to try the following BLT set-up from the root directory(ex:'/Users/yourname/') where you have full permissions to install the softwares/dependencies.

5. Fork/Clone this project repository and follow the set-up instructions below

----
## Set-up Local Environment

BLT provides an automation layer for testing, building, and launching Drupal 8 applications. For ease when updating codebase it is recommended to use **Drupal VM**. If you prefer, you can use another tool such as [DDEV](https://docs.acquia.com/blt/install/alt-env/ddev/), [Docksal](https://docs.acquia.com/blt/install/alt-env/docksal/), [Lando](https://docs.acquia.com/blt/install/alt-env/lando/) or your own custom LAMP stack, however support is very limited for these solutions.


1. Install composer dependencies
    ```
    $ composer install
    ```
2. Check the BLT version by executing ```$ blt --version``` and it would be 11.7.0 and if you observe "blt: command not found" error, then execute the following scripts where first one is to run BLT's shell alias script that should have originally on project creation -- and the second command refreshes your terminal session.
    ```
    $ composer run-script blt-alias
    $ source ~/.bash_profile
    ```

3. Proceed the VM set-up:
    ```
    $ vagrant up
    ```

4. SSH into your localized Drupal VM environment:
    ```
    $ vagrant ssh
    ```

5. Set-up a local Drupal site with an empty database by following first command. Just to add a note that If it is a multisite we can identify a specific site.
   ```
     $ blt setup
    ```
   or
   ```
   $ blt setup --site=[sitename]
   ```

+   **Note:**
    If console is looking for user input during installation, proceed with default option by press enter as we followed already in lando project and if any exception "Drupal\Core\Installer\Exception\InstallerException" throws which is due to permission, then please give permission to the docroot folder by executing ```$ chmod -R 777 docroot``` for installing respective plugins belongs to umami profile and execute again ```blt setup```. I will work with developers to get rid of this exception.


6. Now you would all set to see the umami site and log into your site(http://local.qa-hackathon-drupal-vm.com) with drush:
    ```
    $ cd docroot
    $ drush uli
    ```

7. Please refer this [documentation](https://docs.acquia.com/blt/developer/testing/) about further details on how to configure and execute your behat/phpunit automated scripts with blt.


8. Execute ```blt``` and observe the list of blt commands available and below are the commands available for testing
```
  tests:acsf:validate                  Executes the acsf-init-validate command.
  tests:behat:init:config              [tbic|setup:behat] Generates tests/behat/local.yml file for executing Behat tests locally.
  tests:behat:list:definitions         [tbd|tests:behat:definitions] Lists available Behat step definitions.
  tests:behat:run                      [tbr|behat|tests:behat] Executes all behat tests. This optionally launch Selenium    prior to execution.
  tests:composer:validate              [tcv|validate:composer] Validates root composer.json and composer.lock files.
  tests:drupal:run                     [tdr] Executes tests with Drupal core's testing framework. Launches chromedriver prior to execution.
  tests:frontend:run                   [tfr|tests:frontend|frontend:test] Executes frontend-test target hook.
  tests:php:lint                       [tpl|lint|validate:lint] Runs a PHP Lint against all validate.lint.filesets files.
  tests:phpcs:sniff:all                [tpsa|phpcs|tests:phpcs:sniff|validate:phpcs] Executes PHP Code Sniffer against configured files.
  tests:phpcs:sniff:files              [tpsf] Executes PHP Code Sniffer against a list of files.
  tests:phpcs:sniff:modified           [tpsm] Executes PHPCS against (unstaged) modified or untracked files in repo.
  tests:phpcs:sniff:staged             [tpss] Executes PHPCS against staged files in repo.
  tests:phpunit:run                    [tpr|phpunit|tests:phpunit] Executes all PHPUnit tests.
  tests:security:check:composer        [tscom|security|tests:composer] Check composer.lock for security updates.
  tests:security:check:updates         [tscu|security|tests:security-updates] Check local Drupal installation for security updates.
  tests:server:kill                    [tsk] Kills running PHP web server.
  tests:server:start                   [tss] Starts a temporary PHP web server.
  tests:twig:lint:all                  [ttla|twig|tests:twig:lint|validate:twig] Executes Twig validator against all validate.twig.filesets files.
  tests:twig:lint:files                [ttlf] Executes Twig validator against a list of files, if in twig.filesets.
  tests:yaml:lint:all                  [tyla|yaml|tests:yaml:lint|validate:yaml] Executes YAML validator against all validate.yaml.filesets files.
  tests:yaml:lint:files                [tylf] Executes YAML validator against files, if in validate.yaml.filesets.
  ````

### Troubleshooting/Good References

Please follow the troubleshooting steps, if you face similar issues during installation.

1. [For composer clear-cache & increase the the process timeout](https://docs.acquia.com/blt/install/creating-new-project/#troubleshooting)

2. [BLT Installation: Time saving tips & tricks](https://support.acquia.com/hc/en-us/articles/360012455413-BLT-Installation-Time-saving-tips-tricks)

3. [Fix VBox Manage Error](https://stackoverflow.com/questions/59961222/there-was-an-error-while-executing-vboxmanage-vboxmanage-error-details-co)

4. [Allow on git-credential-osxkeychain popup](https://stackoverflow.com/questions/33636467/unable-to-click-always-allow-on-git-credential-osxkeychain-popup)

5. [Configure your tests with selenium in vagrant](https://www.lullabot.com/articles/running-behat-tests-in-a-vagrant-box)
### Important Configuration Files

**Note:** BLT uses a number of configuration (`.yml` or `.json`) files to define and customize the behaviors. Some examples of these are:

* `blt/blt.yml` (formerly blt/project.yml prior to BLT 9.x)
* `blt/local.blt.yml` (local only specific blt configuration)
* `box/config.yml` (if using Drupal VM)
* `drush/sites` (contains Drush aliases for this project)
* `composer.json` (includes required components, including Drupal Modules, for this project)
