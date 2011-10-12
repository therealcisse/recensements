<div class="container">
    <div class="wrapper">
        <form id="report_form">

            <div id="msg" style="display:none;" class="clearfix"></div>

            <fieldset class="collapsible">

                <legend><h2>Les Paramètres</h2></legend>

                <div class="row first">
                    <div class="side">

                        <div class="box">
                            <div class="formelement">
                                <p class="label">
                                    <label for="DisplayType">Type d'Affiche :</label>
                                </p>

                                <p class="select">
                                    <select name="DisplayType" id="DisplayType">
                                        <option value="1" selected="selected">Journalier</option>
                                        <option value="2">Hebdomadaire</option>
                                        <option value="3">Mensuel</option>
                                    </select>
                                </p>
                            </div>
                        </div>

                        <div class="box">

                            <div class="formelement">
                                <p class="label">
                                    <label for="StartDate">Date de Début :</label>
                                </p>

                                <p class="text">
                                    <input class="date-pick" name="StartDate" id="StartDate" type="text"/>
                                </p>
                            </div>

                            <div class="formelement">
                                <p class="label">
                                    <label for="EndDate">Date de Fin :</label>
                                </p>

                                <p class="select">
                                    <input class="date-pick" name="EndDate" id="EndDate" type="text"
                                           value="<?php echo date('Y-m-d') ?>"/>
                                </p>
                            </div>

                        </div>
                    </div>

                    <div class="side">
                        <div class="box">

                            <div class="formelement">
                                <p class="label">
                                    <label for="Keywords">Les Mots-Clés :</label>
                                </p>

                                <p class="textarea">
                                    <textarea style="width: 250px;" name="Keywords" id="Keywords" rows="7"
                                              cols="30"></textarea>
                                </p>
                            </div>

                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>

                <div class="row last spacer clearfix">
                    <input type="submit" value="Générer le graphe" id="generate_report_submit" name="generate_report"/>
                </div>

            </fieldset>

        </form>
    </div>
</div>